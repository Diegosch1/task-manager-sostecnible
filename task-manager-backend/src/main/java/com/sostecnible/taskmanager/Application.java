package com.sostecnible.taskmanager;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class Application {

	@PostConstruct
    public void init() {
        // Set JVM timezone to Colombia time
        TimeZone.setDefault(TimeZone.getTimeZone("America/Bogota"));
    }
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
