
package com.tripzy;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> healthCheck() {
        return Map.of(
            "application", "Tripzy",
            "status", "UP",
            "message", "Tripzy backend is running successfully!"
        );
    }
}
