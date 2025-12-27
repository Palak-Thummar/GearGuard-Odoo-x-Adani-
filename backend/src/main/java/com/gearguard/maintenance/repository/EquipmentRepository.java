package com.gearguard.maintenance.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gearguard.maintenance.model.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> { }
