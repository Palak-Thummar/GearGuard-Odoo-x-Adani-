package com.gearguard.maintenance.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.model.Stage;
import com.gearguard.maintenance.repository.StageRepository;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {
    private final StageRepository stageRepo;

    public StageController(StageRepository stageRepo) {
        this.stageRepo = stageRepo;
    }

    @GetMapping
    public List<Stage> getAllStages() {
        return stageRepo.findAll();
    }
}
