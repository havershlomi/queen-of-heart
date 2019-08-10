package QueenOfHeart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(path = "/")
public class IndexController {

    @GetMapping(path = "/")
    public String index() {
        return "index";
    }

    @GetMapping(path = "/player")
    public String player() {
        return "index";
    }

    @GetMapping(path = "/game")
    public String game() {
        return "index";
    }
}