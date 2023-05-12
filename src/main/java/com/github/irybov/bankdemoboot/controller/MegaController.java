package com.github.irybov.bankdemoboot.controller;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.irybov.bankdemoboot.security.AccountDetailsService;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins="http://"+"${server.address}"+":"+"${server.port}", allowCredentials="true")
@Slf4j
@RestController
public class MegaController {
	
	private final AdminController admin;
	private final AuthController auth;
	private final BankController bank;
	
	@Autowired
	private AccountDetailsService details;

	public MegaController(AdminController admin, AuthController auth, BankController bank) {
		this.admin = admin;
		this.auth = auth;
		this.bank = bank;
	}
	
	private Authentication authentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/control")
	public String changeServiceImpl(@RequestParam String impl, HttpServletResponse response) {
		
		if(impl.equals("JPA") || impl.equals("DAO")) {
		
			details.setServiceImpl(impl);
			String bean = auth.setServiceImpl(impl);
			log.info("Admin {} has switched services impementation to {}",
					authentication().getName(), impl);
			return "Services impementation has been switched to " + bean;
		}
		else {response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return "Wrong implementation type, retry";
		}
	}
	
}
