package com.gearguard.maintenance.repository;

import com.gearguard.maintenance.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, Long> { }
