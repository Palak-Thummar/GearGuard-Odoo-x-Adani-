package com.gearguard.maintenance.model;

import jakarta.persistence.*;

@Entity
public class Team {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String members; // comma-separated simple field for demo

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMembers() { return members; }
    public void setMembers(String members) { this.members = members; }
}
