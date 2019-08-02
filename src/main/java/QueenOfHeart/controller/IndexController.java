package QueenOfHeart.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping(path = "/")
public class IndexController {

    @GetMapping(path = "/index")
    public String index() {
        return "index";

    }
}