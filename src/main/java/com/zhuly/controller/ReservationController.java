package com.zhuly.controller;

import com.zhuly.domain.Reservation;
import com.zhuly.dto.ReservationRequest;
import com.zhuly.service.ReservationService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public Reservation create(@RequestParam(defaultValue = "1") Long userId,
                              @Valid @RequestBody ReservationRequest request) {
        return reservationService.create(userId, request);
    }

    @GetMapping("/mine")
    public List<Reservation> mine(@RequestParam(defaultValue = "1") Long userId) {
        return reservationService.mine(userId);
    }

    @PostMapping("/{id}/cancel")
    public Reservation cancel(@PathVariable Long id, @RequestParam(defaultValue = "1") Long userId) {
        return reservationService.cancel(userId, id);
    }
}
