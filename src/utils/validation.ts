export const validateName = (name: string) => {
  const nameRegex = /^[A-Z][a-zA-Z]*(?: [A-Z][a-zA-Z]*){0,3}$/;

  if (!name.trim()) return "Name is required";

  if (!nameRegex.test(name)) {
    return "Only alphabets allowed, each word must start with capital letter, spaces allowed between words only";
  }

  if (name.length > 20) {
    return "Name must be maximum 20 characters";
  }

  return "";
};


export const validateEmail=(email:string)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!email.trim()) return "Email is required";
  if(!emailRegex.test(email)){
    return "Invalid email address"
  }
  return ""
}

export const validatePhone=(phone:string)=>{
  const phoneRegex=/^[0-9]{10}$/;
  if(!phone.trim()) return "Phone is required";
  if(!phoneRegex.test(phone)) return "Phone must be 10 digits";
  return ""
}

export const validatePassword=(password:string)=>{
  const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
  if(!password.trim()) return "Password is required";
  if(!passwordRegex.test(password)){
    return "Password must be 8-15 characters ,include upper ,lower , number & special character"
  }
  return ""
}

export const validateConfirmPassword=(confirmPassword:string,password:string,)=>{

  if(!confirmPassword.trim()) return "ConfirmPassword is required";

  if (confirmPassword !== password) return "Passwords do not match";
  return ""
}