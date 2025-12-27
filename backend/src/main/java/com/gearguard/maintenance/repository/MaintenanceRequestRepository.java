package com.gearguard.maintenance.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gearguard.maintenance.model.MaintenanceRequest;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByEquipmentId(Long equipmentId);

    @Query("SELECT t.name as team, COUNT(r) as count FROM MaintenanceRequest r JOIN r.team t GROUP BY t.name")
    List<Map<String, Object>> countRequestsByTeam();

    @Query("SELECT r.category as category, COUNT(r) as count FROM MaintenanceRequest r WHERE r.category IS NOT NULL GROUP BY r.category")
    List<Map<String, Object>> countRequestsByCategory();

    @Query("SELECT r.type as type, COUNT(r) as count FROM MaintenanceRequest r GROUP BY r.type")
    List<Map<String, Object>> countRequestsByType();
}
