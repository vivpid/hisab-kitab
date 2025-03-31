package com.vipid.hisab_kitab.Users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.vipid.hisab_kitab.Event.Event;
import com.vipid.hisab_kitab.Expense.Expense;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;


@Entity
@Setter
@Getter
@ToString
public class Users {

    @Id
    private String userId;

    private String name;

    private String email;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Expense> expenses;
}

