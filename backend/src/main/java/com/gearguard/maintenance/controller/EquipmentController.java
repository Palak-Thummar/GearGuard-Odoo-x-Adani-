package com.gearguard.maintenance.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.model.Equipment;
import com.gearguard.maintenance.model.MaintenanceRequest;
import com.gearguard.maintenance.repository.EquipmentRepository;
import com.gearguard.maintenance.repository.MaintenanceRequestRepository;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {
    private final EquipmentRepository repo;
    private final MaintenanceRequestRepository requestRepo;
    
    public EquipmentController(EquipmentRepository repo, MaintenanceRequestRepository requestRepo) { 
        this.repo = repo;
        this.requestRepo = requestRepo;
    }

    @GetMapping
    public List<Equipment> list() { return repo.findAll(); }

    @PostMapping
    public Equipment create(@RequestBody Equipment payload) { return repo.save(payload); }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/maintenance-requests")
    public List<MaintenanceRequest> getMaintenanceRequests(@PathVariable Long id) {
        return requestRepo.findByEquipmentId(id);
    }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getEquipmentStats(@PathVariable Long id) {
        Map<String, Object> stats = new HashMap<>();
        List<MaintenanceRequest> requests = requestRepo.findByEquipmentId(id);
        stats.put("totalRequests", requests.size());
        stats.put("openRequests", requests.stream().filter(r -> r.getStage() != null && !r.getStage().isDone()).count());
        stats.put("completedRequests", requests.stream().filter(r -> r.getStage() != null && r.getStage().isDone()).count());
        return stats;
    }
}
