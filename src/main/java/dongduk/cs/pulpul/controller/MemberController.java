package dongduk.cs.pulpul.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import dongduk.cs.pulpul.domain.Member;
import dongduk.cs.pulpul.service.BorrowService;
import dongduk.cs.pulpul.service.MemberService;
import dongduk.cs.pulpul.service.OrderService;
import dongduk.cs.pulpul.service.exception.LoginException;
import dongduk.cs.pulpul.validator.ChangeMemberInfoValidator;
import dongduk.cs.pulpul.validator.LoginValidator;
import dongduk.cs.pulpul.validator.PasswordCheckValidator;
import dongduk.cs.pulpul.validator.RegisterValidator;

@Controller
@RequestMapping("/member")
public class MemberController {
	
	private final MemberService memberService;
	private final OrderService orderService;
	private final BorrowService borrowService;
	
	@Autowired 
	public MemberController(MemberService memberService, OrderService orderService, BorrowService borrowService) {
		this.memberService = memberService;
		this.orderService = orderService;
		this.borrowService = borrowService;
	}
	
	@Autowired
	private LoginValidator loginValidator;
	public void setValidator(LoginValidator loginValidator) {
		this.loginValidator = loginValidator;
	}
	
	@Autowired
	private RegisterValidator registerValidator;
	public void setValidator(RegisterValidator registerValidator) {
		this.registerValidator = registerValidator;
	}
	
	@Autowired
	private ChangeMemberInfoValidator changeMemberInfoValidator;
	public void setValidator(ChangeMemberInfoValidator changeMemberInfoValidator) {
		this.changeMemberInfoValidator = changeMemberInfoValidator;
	}
	
	@Autowired
	private PasswordCheckValidator passwordCheckValidator;
	public void setValidator(PasswordCheckValidator passwordCheckValidator) {
		this.passwordCheckValidator = passwordCheckValidator;
	}
	
	@ModelAttribute("member")
	public Member formBacking() {
		return new Member();
	}

	/* 
	 * ?????? ?????? ??? ??????
	 */
	@GetMapping("/register")
	public String registerForm() {
		return "member/registerForm";
	}
	
	/* 
	 * ?????? ??????
	 */
	@PostMapping("/register")
	public String register(@ModelAttribute("member") Member member, Errors result, Model model, HttpServletRequest req) {
		model.addAttribute("member", member);
		registerValidator.validate(member, result);
		if(result.hasErrors()) {
			return "member/registerForm";
		}
		else {
			memberService.register(member);
			return "member/loginForm";
		}
	}

	/*
	 * ????????? ??? ??????
	 */
	@GetMapping("/login")
	public String loginForm() {
		return "/member/loginForm";
	}
	
	/*
	 * ?????????
	 */
	@PostMapping("/login")
	public String login(@ModelAttribute("member") Member member, Errors result, Model model, HttpServletRequest req, RedirectAttributes rttr) {
		model.addAttribute("member", member);
		loginValidator.validate(member, result);
		if(result.hasErrors()) {
			return "member/loginForm";
		}
		
		try {
			member = memberService.login(member);
			
			HttpSession session = req.getSession();
			session.setAttribute("id", member.getId());
			
			if (member.getId() != null) {
				// ???????????? ?????? ??? ????????? ??????
				int numberOfCartItem = orderService.getNumberOfCartItemByMember(member.getId());
				session.setAttribute("cartItemCnt", numberOfCartItem);
				System.out.println(numberOfCartItem);
				
				// ?????? ?????? ?????? ??? ????????? ??????
				int alertCount = borrowService.getAlertCountByIsRead(member.getId());
				session.setAttribute("alertCnt", alertCount);
				System.out.println(alertCount);
			}
			
			return "redirect:/home";
		} catch (LoginException e) {
			e.printStackTrace(); 
			
			rttr.addFlashAttribute("loginFailed", true); 
			rttr.addFlashAttribute("exception", e.getMessage());
			
			result.reject("invalidIdOrPassword", new Object[] {member.getId()}, null);
			return "member/loginForm";
		}
	}
	
	/*
	 * ?????? ?????? ?????? ??? ??????
	 */
	@GetMapping("/passwordCheck")
	public String passwordCheck(HttpServletRequest req, ModelAndView mav) {
		// ???????????? ?????? ??? ??????
		return "member/passwordCheck";
	}
	
	/*
	 * ???????????? ?????? ??? ???????????? ??????
	 */
	@PostMapping("/passwordCheck")
	public String passwordCheck(@ModelAttribute("member") Member member, Errors result, Model model, HttpServletRequest req) {
		HttpSession session = req.getSession();
		String id = (String) session.getAttribute("id");
		Member memberInfo = memberService.getMember(id);
		if (memberInfo != null) {
			member.setPassword(memberInfo.getPassword());
			model.addAttribute("member", member);
			
			passwordCheckValidator.validate(member, result);
			if(result.hasErrors()) {
				return "member/passwordCheck";
			}
			else {
				return "redirect:/member/view";
			}
		}
		
		return "member/passwordCheck";
	}
	
	/*
	 * ?????? ?????? ?????? ??? ??????
	 */
	@GetMapping("/view")
	public ModelAndView view(HttpServletRequest req, ModelAndView mav) {
		HttpSession session = req.getSession();
		String id = (String) session.getAttribute("id");
		Member member = memberService.getMember(id);
		if (member != null) {
			// ???????????? ?????? ??????
			String birth = member.getBirth().split(" ")[0];
			member.setBirth(birth.replaceAll("-", ""));
			mav.addObject("member", member);
		}
		mav.setViewName("member/myInfoForm");
		return mav;
	}
	
	/*
	 * ?????? ?????? ??????
	 */
	@PostMapping("/update")
	public String update(@ModelAttribute("member") Member member, Errors result, Model model, HttpServletRequest req) {
		HttpSession session = req.getSession();
		String id = (String) session.getAttribute("id");
		if (member != null) {
			member.setId(id);
			model.addAttribute("member", member);
			
			changeMemberInfoValidator.validate(member, result);
			if(result.hasErrors()) {
				return "member/myInfoForm";
			}
			else {
				memberService.changeMemberInfo(member);
				return "redirect:/member/view";
			}
		}
		return "member/myInfoForm";
	}
	
	/*
	 * ????????????
	 */
	@GetMapping("/logout")
	public String logout(HttpServletRequest req, RedirectAttributes rttr) {
		HttpSession session = req.getSession();
		session.invalidate();
		
		return "redirect:/home";
	}
}
