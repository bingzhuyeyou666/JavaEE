package com.zhuly.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelCopyResponse {
    private String title;
    private String content;
    private List<String> tags = new ArrayList<String>();
    private String category;
    private String postType;
    private String source;
}
