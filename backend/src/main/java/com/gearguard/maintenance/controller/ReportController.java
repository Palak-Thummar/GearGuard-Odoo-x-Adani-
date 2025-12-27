package com.gearguard.maintenance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.repository.MaintenanceRequestRepository;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    private final MaintenanceRequestRepository requestRepo;

    public ReportController(MaintenanceRequestRepository requestRepo) {
        this.requestRepo = requestRepo;
    }

    @GetMapping("/requests-by-team")
    public List<Map<String, Object>> getRequestsByTeam() {
        return requestRepo.countRequestsByTeam();
    }

    @GetMapping("/requests-by-category")
    public List<Map<String, Object>> getRequestsByCategory() {
        return requestRepo.countRequestsByCategory();
    }

    @GetMapping("/requests-by-type")
    public List<Map<String, Object>> getRequestsByType() {
        return requestRepo.countRequestsByType();
    }
}
