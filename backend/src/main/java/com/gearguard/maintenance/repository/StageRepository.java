package com.gearguard.maintenance.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gearguard.maintenance.model.Stage;

public interface StageRepository extends JpaRepository<Stage, Long> {
    Optional<Stage> findByName(String name);
}
