import { useContext } from "react";
import Navbar from "../componants/Navbar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Utility/AuthContext";

const Login = ({message}) => {

  if(message)
  {
    alert(message)
  }
  const {setRole,setLogin} = useContext(AuthContext);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
      console.log(data)
        try {
          const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.email,
              password: data.password,
            }),
          });

          if (!response.ok) {
            throw new Error("Bad Credentials");
          }

          //parsing token and user role
          const result = await response.json();
          console.log(result);

          //setting generated token and role of user in localStorage
          localStorage.setItem("token", result.token);
          localStorage.setItem("role", result.role);

          //enable when project isready
          //save role and login status in Auth conetext to save state
          setRole(result.role)
          setLogin(true)

          //role based home(dashboard) page navigation
          switch (result.role) {
            case "USER":
              navigate("/home");
              break;

            case "ADMIN":
              navigate("/admin/dashboard");
              break;

            case "SELLER":
              navigate("/home");
              break;

          }

          //pop-up message for loginsucsess
          alert("Login successful");
        } catch (e) {
            //Error message - usually Bad Credentials
            alert(e.message)
            console.log(e.message);
        }
    };
    return (
      <div>
        <Navbar />
        <center><h2>Login Now</h2></center>
        <form
          style={{ width: "50vw", marginLeft: "30vw" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <br />
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              {...register("email")}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              {...register("password"
              //, {
              //   required: "Password is required",
              //   pattern: {
              //     value:
              //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,20}$/,
              //       message:"password must contain lowercase,uppercase,number and special character",
              //   },
              //   minLength: {
              //     value: 9,
              //     message: "Password must be at least 9 characters",
              //   },
              // }
              )}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>
          <input type="Submit" className="btn btn-primary"></input>
        </form>
      </div>
    );
};

export default Login;
