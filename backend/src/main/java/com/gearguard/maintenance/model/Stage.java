package com.gearguard.maintenance.model;

import jakarta.persistence.*;

@Entity
public class Stage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer sequence = 10;
    private boolean done = false;
    private boolean scrap = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getSequence() { return sequence; }
    public void setSequence(Integer sequence) { this.sequence = sequence; }
    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }
    public boolean isScrap() { return scrap; }
    public void setScrap(boolean scrap) { this.scrap = scrap; }
}
