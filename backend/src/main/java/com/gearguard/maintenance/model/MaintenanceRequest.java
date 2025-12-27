package com.gearguard.maintenance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MaintenanceRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type; // corrective or preventive
    private String category;
    private String technician;
    private LocalDateTime scheduledDate;
    private Double duration;
    private String description;
    private boolean overdue = false;

    @ManyToOne(optional = false)
    private Equipment equipment;

    @ManyToOne
    private Team team;

    @ManyToOne
    private Stage stage;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTechnician() { return technician; }
    public void setTechnician(String technician) { this.technician = technician; }
    public LocalDateTime getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDateTime scheduledDate) { this.scheduledDate = scheduledDate; }
    public Double getDuration() { return duration; }
    public void setDuration(Double duration) { this.duration = duration; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isOverdue() { return overdue; }
    public void setOverdue(boolean overdue) { this.overdue = overdue; }
    public Equipment getEquipment() { return equipment; }
    public void setEquipment(Equipment equipment) { this.equipment = equipment; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }
}
