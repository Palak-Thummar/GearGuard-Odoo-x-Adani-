package com.gearguard.maintenance.model;

import jakarta.persistence.*;

@Entity
public class Equipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String serialNo;
    private String category;
    private String location;
    private String defaultTechnician;
    private boolean scrapped = false;

    @ManyToOne
    private Team maintenanceTeam;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSerialNo() { return serialNo; }
    public void setSerialNo(String serialNo) { this.serialNo = serialNo; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDefaultTechnician() { return defaultTechnician; }
    public void setDefaultTechnician(String defaultTechnician) { this.defaultTechnician = defaultTechnician; }
    public boolean isScrapped() { return scrapped; }
    public void setScrapped(boolean scrapped) { this.scrapped = scrapped; }
    public Team getMaintenanceTeam() { return maintenanceTeam; }
    public void setMaintenanceTeam(Team maintenanceTeam) { this.maintenanceTeam = maintenanceTeam; }
}
