package com.vipid.hisab_kitab.Expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query(value = "SELECT * FROM Expense e WHERE EVENT_ID = :eventId", nativeQuery = true)
    public List<Expense> findAllByEventId(Long eventId);
}
