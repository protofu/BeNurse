package com.ssafy.notice.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.ssafy.notice.model.Notice;

@Service
public class NoticeService {
	
	@Autowired
	NoticeRepository noticeRepo;
	
	@Cacheable(value = "notice", key = "#ID")
	public Notice findById(long ID) {
		Optional<Notice> option = noticeRepo.findById(ID);
		if(option.isPresent())
			return option.get();
		else
			throw new NullPointerException();
	}
	
	@CachePut(value = "notice", key="#notice.ID")
	public Notice save(Notice notice) {
		try {
			if(notice.getID() == 0)
				throw new NullPointerException();
			Notice exist = findById(notice.getID());
			return noticeRepo.save(notice);
		}catch (Exception e) {
			e.printStackTrace();
			throw new NullPointerException();
		}
		
	}
	
	@CacheEvict(value = "notice", key = "#ID")
	public void delete(long ID) {
		try {
			Notice notice = findById(ID);
			noticeRepo.delete(notice);
		}catch (Exception e) {
			e.printStackTrace();
			throw new NullPointerException();
		}
	}
}
