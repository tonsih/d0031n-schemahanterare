package dev.toni.time_edit.kurs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KursService {
    private final KursRepository kursRepository;

    @Autowired
    public KursService(KursRepository kursRepository) {
        this.kursRepository = kursRepository;
    }

    public List<Kurs> getKurser() {
        return this.kursRepository.findAll();
    }
}