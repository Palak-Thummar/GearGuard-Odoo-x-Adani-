package com.gearguard.maintenance.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gearguard.maintenance.model.Team;
import com.gearguard.maintenance.repository.TeamRepository;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*")
public class TeamController {
    private final TeamRepository repo;
    public TeamController(TeamRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Team> list() { return repo.findAll(); }

    @PostMapping
    public Team create(@RequestBody Team payload) { return repo.save(payload); }
}
