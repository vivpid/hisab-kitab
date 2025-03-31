package com.vipid.hisab_kitab.Event;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.vipid.hisab_kitab.Expense.Expense;
import com.vipid.hisab_kitab.Users.Users;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Setter
@Getter
@ToString
public class Event {

    @Id
    private Integer eventId;

    private String eventName;

    private String eventDate;

    @OneToMany(mappedBy = "event", cascade = CascadeType.PERSIST)
    @JsonIgnore
    @Nullable
    private Set<Users> users;

    @JsonProperty("users")
    private Set<String> getUserIds(){
        if(users==null) return null;
        return users.stream().map(Users::getUserId)
                .collect(Collectors.toSet());
    }
    private String initiatorId;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Expense> expenses;

    private String inviteKey;

}
