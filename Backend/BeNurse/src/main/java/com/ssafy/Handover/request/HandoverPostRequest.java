package com.ssafy.Handover.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class HandoverPostRequest {
	private long setID;
	private HandoverRequest handover;

}
