package com.gearguard.maintenance.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.model.Equipment;
import com.gearguard.maintenance.model.MaintenanceRequest;
import com.gearguard.maintenance.model.Stage;
import com.gearguard.maintenance.repository.EquipmentRepository;
import com.gearguard.maintenance.repository.MaintenanceRequestRepository;
import com.gearguard.maintenance.repository.StageRepository;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {
    private final MaintenanceRequestRepository requestRepo;
    private final EquipmentRepository equipmentRepo;
    private final StageRepository stageRepo;

    public RequestController(MaintenanceRequestRepository requestRepo, EquipmentRepository equipmentRepo, StageRepository stageRepo) {
        this.requestRepo = requestRepo;
        this.equipmentRepo = equipmentRepo;
        this.stageRepo = stageRepo;
    }

    @GetMapping
    public List<MaintenanceRequest> list() { return requestRepo.findAll(); }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@RequestBody MaintenanceRequest payload) {
        Equipment eq = equipmentRepo.findById(payload.getEquipment().getId()).orElse(null);
        if (eq == null) return ResponseEntity.notFound().build();
        // Auto-fill
        if (payload.getCategory() == null) payload.setCategory(eq.getCategory());
        if (payload.getTeam() == null) payload.setTeam(eq.getMaintenanceTeam());
        if (payload.getTechnician() == null) payload.setTechnician(eq.getDefaultTechnician());
        // Ensure managed relation
        payload.setEquipment(eq);
        // Default name & stage
        if (payload.getName() == null || payload.getName().isBlank()) {
            payload.setName("REQ-" + System.currentTimeMillis());
        }
        Stage newStage = stageRepo.findByName("New").orElse(null);
        if (payload.getStage() == null) payload.setStage(newStage);
        // Overdue compute (if scheduled in past and not done)
        if (payload.getScheduledDate() != null) {
            boolean overdue = payload.getScheduledDate().isBefore(LocalDateTime.now()) && (payload.getStage() == null || !payload.getStage().isDone());
            payload.setOverdue(overdue);
        }
        return ResponseEntity.ok(requestRepo.save(payload));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> update(@PathVariable Long id, @RequestBody MaintenanceRequest patch) {
        return requestRepo.findById(id).map(req -> {
            if (patch.getStage() != null) {
                Long stageId = patch.getStage().getId();
                if (stageId != null) {
                    stageRepo.findById(stageId).ifPresent(req::setStage);
                }
            }
            if (patch.getDuration() != null) req.setDuration(patch.getDuration());
            // Scrap logic
            if (req.getStage() != null && req.getStage().isScrap() && req.getEquipment() != null) {
                Equipment eq = req.getEquipment();
                if (!eq.isScrapped()) {
                    eq.setScrapped(true);
                    equipmentRepo.save(eq);
                }
            }
            // Overdue recompute
            if (req.getScheduledDate() != null) {
                boolean overdue = req.getScheduledDate().isBefore(LocalDateTime.now()) && (req.getStage() == null || !req.getStage().isDone());
                req.setOverdue(overdue);
            }
            return ResponseEntity.ok(requestRepo.save(req));
        }).orElse(ResponseEntity.notFound().build());
    }
}
