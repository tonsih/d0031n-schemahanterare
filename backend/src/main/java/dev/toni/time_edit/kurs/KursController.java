package dev.toni.time_edit.kurs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/kurser")
public class KursController {

    private final KursService kursService;

    @Autowired
    public KursController(KursService kursService) {
        this.kursService = kursService;
    }

    @GetMapping
    public ResponseEntity<List<Kurs>> getKurser() {
        List<Kurs> kurser = this.kursService.getKurser();
        return new ResponseEntity<>(kurser, HttpStatus.OK);
    }

}