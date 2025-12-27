package com.gearguard.maintenance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.model.Equipment;
import com.gearguard.maintenance.repository.EquipmentRepository;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class EquipmentController {
    private final EquipmentRepository repo;
    public EquipmentController(EquipmentRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Equipment> list() { return repo.findAll(); }

    @PostMapping
    public Equipment create(@RequestBody Equipment payload) { return repo.save(payload); }

    @GetMapping("/{id}")
    public ResponseEntity<Equipment> get(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
