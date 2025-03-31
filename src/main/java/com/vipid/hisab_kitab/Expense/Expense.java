package com.vipid.hisab_kitab.Expense;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.vipid.hisab_kitab.Event.Event;
import com.vipid.hisab_kitab.Users.Users;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@ToString
@Setter
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expenseId;

    private Long amount;

    private String description;

    // Many-to-one relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users user;

    private List<String> creditors;

    // Many-to-one relationship with Event
    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    @JsonProperty("userName")
    public String getUserName(){
        return user != null ? user.getName() : null;
    }
    @JsonProperty("eventId")
    public Integer getEventId(){
        return event != null ? event.getEventId() : null;
    }
}
