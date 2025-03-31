package com.vipid.hisab_kitab;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.vipid.hisab_kitab.Event.Event;
import com.vipid.hisab_kitab.Expense.Expense;
import com.vipid.hisab_kitab.Users.Users;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class Utils {
    private static final Logger logger = LoggerFactory.getLogger(Utils.class);
    private static final Email EMAIL_FROM= new Email("hisabkitabmailer@gmail.com");
    private static final String EMAIL_SUBJECT="Event Summary";
    private static final String FILEPATH = "./eventData.json";

    private static Content getContent(String userName,String eventName) {
        String htmlContent = "<html><body>"+
                "<p>Hi <b>"+userName+"</b>,</p><br/>"+
                "<p>Your Event <b>\""+eventName+"\"</b> has just ended.</p>"+
                "<p>We have attached the all data from the event to this email for future use</p>"+
                "<p>This is data has been removed from our system for optimize storage"+
                "<br/><p>Thanks!</p>"+
                "<p>HisabKitab Team</p>"+
                "<p>"+EMAIL_FROM.getEmail()+"</p>";
        Content content = new Content("text/html", htmlContent);
        return content;
    }

    public static void sendMail(Users user, String eventName,String sendGridApiKey) throws IOException {
        Email toEmail = new Email(user.getEmail());

        // Create the mail object
        Mail mail = new Mail(EMAIL_FROM, EMAIL_SUBJECT, toEmail, getContent(user.getName(),eventName));
        addJsonAttachment(mail);
        // Set up the SendGrid client and send the email
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();
        request.setMethod(Method.POST);
        request.setEndpoint("mail/send");
        request.setBody(mail.build());

        // Send the email
        sg.api(request);
    }

    private static void addJsonAttachment(Mail mail) throws IOException {
        // Read the JSON file
        File file = new File(FILEPATH);
        FileInputStream fileInputStream = new FileInputStream(file);

        // Encode the file content as Base64
        byte[] fileContent = new byte[(int) file.length()];
        fileInputStream.read(fileContent);
        String encodedFile = Base64.getEncoder().encodeToString(fileContent);
        fileInputStream.close();

        // Create the attachment object
        Attachments attachment = new Attachments();
        attachment.setContent(encodedFile);  // File content encoded in Base64
        attachment.setType("application/json");  // MIME type for JSON
        attachment.setFilename(file.getName());  // Use the file's name (e.g., event_data.json)
        attachment.setDisposition("attachment");  // Set the disposition to 'attachment'

        // Attach the file to the email
        mail.addAttachments(attachment);
    }

    public static void generateJsonFile(Event event) throws IOException {
        // Create ObjectMapper instance to convert object to JSON
        ObjectMapper objectMapper = new ObjectMapper();

        // Convert Event object to JSON and write to a file
        objectMapper.writeValue(new File(FILEPATH), event);
    }

    public static Map<String,Map<String,Long>> simplifyDebts(Set<Expense> expenseSet, Set<Users> usersSet) {
        Map<String, Long> netBalances = new HashMap<>();

        // Calculate net balance for each person
        for (Expense expense : expenseSet) {
            List<String> creditors = Optional.ofNullable(expense.getCreditors()).orElse(new ArrayList<>());
            Users user = expense.getUser();
            boolean allAreCreditors = false;
            for(String creditor: creditors){
                if(creditor.equals("*")){
                    allAreCreditors = true;
                    break;
                }
                netBalances.compute(creditor, (k,v) ->  Optional.ofNullable(v).orElse(0L) - (expense.getAmount()/(creditors.size()+1)));
            }
            if(allAreCreditors){
                for(Users creditor: usersSet){
                    if(creditor.getUserId().equals(user.getUserId())) continue;
                    netBalances.compute(creditor.getUserId(), (k,v) ->  Optional.ofNullable(v).orElse(0L) - (expense.getAmount()/(usersSet.size())));
                }
                final long totalExpense = (expense.getAmount() / usersSet.size())*(usersSet.size()-1);
                netBalances.compute(user.getUserId(),(k,v) -> Optional.ofNullable(v).orElse(0L) + totalExpense);
            }else {
                final long totalExpense = (expense.getAmount() / (creditors.size() + 1))*creditors.size();
                netBalances.compute(user.getUserId(), (k, v) -> Optional.ofNullable(v).orElse(0L) + totalExpense);
            }
        }

        PriorityQueue<Pair> creditors = new PriorityQueue<>(Comparator.comparingLong(p -> -1*p.value));
        PriorityQueue<Pair> debtors = new PriorityQueue<>(Comparator.comparingLong(p -> p.value));

        for (Map.Entry<String, Long> entry : netBalances.entrySet()) {
            if (entry.getValue() > 0) {
                creditors.add(new Pair(entry.getKey(), entry.getValue()));
            } else if (entry.getValue() < 0) {
                debtors.add(new Pair(entry.getKey(), -1L*entry.getValue()));
            }
        }

        logger.info("Initial "+creditors.toString());
        logger.info("Initial "+debtors.toString());

        Map<String,Map<String,Long>> userOweUser = new HashMap<>();

        while (!debtors.isEmpty() && !creditors.isEmpty()) {
            Pair debtor = debtors.poll();
            Pair creditor = creditors.poll();

            long minAmount = Math.min(debtor.value, creditor.value);
            logger.info(debtor.key + " pays " + creditor.key + " Rs." + minAmount);
            System.out.println(debtor.key + " pays " + creditor.key + " Rs." + minAmount);

            userOweUser.compute(debtor.key, (k,v) -> {
                v = Optional.ofNullable(v).orElse(new HashMap<>());
                v.put(creditor.key, minAmount);
                return v;
            });
            if (debtor.value > minAmount) {
                debtor.value -= minAmount;
                debtors.add(debtor);
            }
            if (creditor.value > minAmount) {
                creditor.value -= minAmount;
                creditors.add(creditor);
            }
        }

        logger.info(netBalances.toString());
        return userOweUser;
    }


    static class Pair{
        String key;
        Long value;
        Pair(String key,Long value){
            this.key=key;
            this.value=value;
        }
        public String toString(){
            return "<"+key+", "+value+"> ";
        }
    }
}
