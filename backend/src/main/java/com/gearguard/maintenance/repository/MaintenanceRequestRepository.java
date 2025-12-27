package com.gearguard.maintenance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gearguard.maintenance.model.MaintenanceRequest;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> { }
