package com.vipid.hisab_kitab;

import com.vipid.hisab_kitab.Event.Event;
import com.vipid.hisab_kitab.Event.EventRepository;
import com.vipid.hisab_kitab.Expense.Expense;
import com.vipid.hisab_kitab.Expense.ExpenseRepository;
import com.vipid.hisab_kitab.Users.UserRepository;
import com.vipid.hisab_kitab.Users.Users;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@RestController("/api")
public class Controller {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/events")
    @Transactional
    public Event createEvent(@RequestBody Event event) throws Exception {
        if (eventRepository.findById(1).isPresent())
            return new Event();
        event.setEventDate(LocalDate.now().toString());
        event.setEventId(1);
        UUID inviteKey = UUID.randomUUID();
        event.setInviteKey(inviteKey.toString());
        event = eventRepository.save(event);
        Users initiator = userRepository.findById(event.getInitiatorId()).orElse(null);
        if (initiator != null)
            addUserToEvent(initiator.getUserId());
        return event;
    }

    @PutMapping("/users")
    public Users createUser(@RequestBody Users user) {
        if (userRepository.findById(user.getUserId()).isEmpty())
            userRepository.save(user);
        return user;
    }

    @GetMapping("/users/{userId}")
    public Users getUser(@PathVariable String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping("/users/{userId}/event")
    public Event getEventForUser(@PathVariable String userId) {
        if (userRepository.findById(userId).isEmpty()) return null;
        return eventRepository.findById(1).orElse(null);
    }

    @GetMapping("/events")
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @PostMapping("/events/addUser/{userId}")
    @Transactional
    public Event addUserToEvent(@PathVariable String userId) throws Exception {
        Users user = userRepository.findById(userId).orElse(null);
        if (user == null)
            return null;
        Event event = eventRepository.findById(1).orElse(null);
        if (event != null) {
            if (user.getEvent() == null) {
                user.setEvent(event);
                userRepository.save(user);
            } else {
                throw new Exception("User Already Part of Another Event");
            }
            Set<Users> usersSet = event.getUsers();
            if (usersSet == null) usersSet = new HashSet<>();
            usersSet.add(user);
            event.setUsers(usersSet);
            event = eventRepository.save(event);
        }
        return event;
    }

    @PostMapping("/users/{userId}/expense")
    public Set<Expense> addExpenseToEvent(@RequestBody Expense expense, @PathVariable String userId) {
        Users user = userRepository.findById(userId).orElse(null);
        Set<Expense> expenses = null;
        if (user != null) {
            Event event = eventRepository.findById(1).orElse(null);
            expense.setUser(user);
            expense.setEvent(event);
            if (event != null) {
                expenses = event.getExpenses();
                expenses.add(expense);
                event.setExpenses(expenses);
                eventRepository.save(event);
            }
        }
        return Optional.of(expenses).orElse(new HashSet<Expense>());
    }

    @GetMapping("/users/settlement")
    public Map<String, Map<String, Long>> getSettlementInfo() {
        Event event = eventRepository.findById(1).orElse(null);
        if (event != null) {
            Map<String, Map<String, Long>> map = Utils.simplifyDebts(event.getExpenses(), event.getUsers());
            return map;
        }
        return null;
    }

    @GetMapping("/events/users")
    public Map<String, String> getAllUsersInEvent() {
        Event event = eventRepository.findById(1).orElse(null);
        Map<String, String> map = new HashMap<>();
        if (event != null) {
            for (Users user : event.getUsers()) {
                map.put(user.getUserId(), user.getName());
            }
        }
        return map;
    }

    @GetMapping("/events/inviteKey")
    public String getInviteKey(){
        Event event = eventRepository.findById(1).orElse(null);
        if(event==null) return "";
        return event.getInviteKey();
    }

    @GetMapping("/events/inviteKey/{inviteKey}")
    public boolean validateInvite(@PathVariable String inviteKey){
        Event event = eventRepository.findById(1).orElse(null);
        if(event==null) return false;
        return event.getInviteKey().equals(inviteKey);
    }

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @DeleteMapping("/events")
    @Transactional
    public String endEvent() throws IOException {
        Event event = eventRepository.findById(1).orElse(null);
//        if(event!=null){
//            Utils.generateJsonFile(event);
//            Set<Users> usersSet = event.getUsers();
//            for(Users user: usersSet)
//                Utils.sendMail(user,event.getEventName(),sendGridApiKey);
        event.setUsers(null);
        List<Users> users = userRepository.findAll();
        for (Users user : users) {
            user.setEvent(null);
            userRepository.save(user);
        }

        eventRepository.save(event);
        eventRepository.deleteAll();
        return "Successfully deleted Event";
//        }
//        return "No Event to Delete";
    }

    @DeleteMapping("/users/{adminId}/delete/{userId}")
    public Map<String, String> deleteUser(@PathVariable String adminId, @PathVariable String userId) {
        if ("105532310443150760976".equals(adminId) && !"105532310443150760976".equals(userId)) {
            Users user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                userRepository.delete(user);
            }
        }
        return getAllUsersInEvent();
    }

    @DeleteMapping("/expense/{expenseId}")
    public Set<Expense> deleteExpense(@PathVariable Long expenseId) {
        expenseRepository.deleteById(expenseId);
        return eventRepository.findById(1).orElse(null).getExpenses();
    }

}
