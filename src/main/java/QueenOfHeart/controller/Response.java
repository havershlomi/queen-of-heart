package QueenOfHeart.controller;

public class Response<T> {

    private String message;
    private T body;

    public Response(String message, T responseBody) {
        this.message = message;
        this.body = responseBody;
    }

    public String getMessage() {
        return message;
    }

    public T getBody() {
        return body;
    }

    public static <K> Response<K> Ok(K body) {
        return new Response<K>("OK", body);
    }

    public static <K> Response<K> Error(K body) {
        return new Response<K>("Error", body);
    }
}
