const BottomNavigationBar = ({ NavLink, darkTheme }) => {
  return (
    <footer className="ft_sm">
      <ul className="ft_sm_inn">
        <li className="ft_sm_li">
          <NavLink
            style={({ isActive }) => {
              return {
                display: "flex",
                fontSize: isActive ? "14px" : "13px",
                fontWeight: isActive && "600",
                opacity: isActive ? "1" : "0.6",
                alignItems: "center",
                flexDirection: "column",
              };
            }}
            to={`/`}
            key={"home"}
          >
            <i className="ph-house-simple"></i>
            <p> Home</p>
          </NavLink>
        </li>
        <li className="ft_sm_li">
          <NavLink
            style={({ isActive }) => {
              return {
                display: "flex",
                fontSize: isActive ? "14px" : "13px",
                fontWeight: isActive && "600",
                opacity: isActive ? "1" : "0.6",
                alignItems: "center",
                flexDirection: "column",
              };
            }}
            to={`/elections`}
            key={"elections"}
          >
            <i className="ph-list-plus-fill"></i>
            <p> Elections</p>
          </NavLink>
        </li>

        {/* Transfer Section */}
        <li className="ft_sm_li">
          <NavLink
            style={({ isActive }) => {
              return {
                width: "35px",
                height: "35px",
                display: "flex",
                borderRadius: "100%",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: isActive && "600",
                background: "var(--main-col)",
                color: !darkTheme ? "#fff" : "",
                border: isActive
                  ? darkTheme
                    ? "1px solid var(--wht)"
                    : "1px solid #666"
                  : "none",
                fontSize: isActive ? "14px" : "13px",
              };
            }}
            to={`/transfer`}
            key={"transfer"}
          >
            <i className="uil uil-exchange"></i>
          </NavLink>
        </li>

        <li className="ft_sm_li">
          <NavLink
            style={({ isActive }) => {
              return {
                display: "flex",
                fontSize: isActive ? "14px" : "13px",
                fontWeight: isActive && "600",
                opacity: isActive ? "1" : "0.6",
                alignItems: "center",
                flexDirection: "column",
              };
            }}
            to={`/faq`}
            key={"faq"}
          >
            <i className="ph-circle-wavy-question"></i>
            <p>Briefs</p>
          </NavLink>
        </li>

        <li className="ft_sm_li">
          <NavLink
            style={({ isActive }) => {
              return {
                display: "flex",
                fontSize: isActive ? "14px" : "13px",
                fontWeight: isActive && "600",
                opacity: isActive ? "1" : "0.6",
                alignItems: "center",
                flexDirection: "column",
              };
            }}
            to={`/settings`}
            key={"settings"}
          >
            <i className="ph-sliders-horizontal-fill"></i>
            <p>Settings</p>
          </NavLink>
        </li>
      </ul>
    </footer>
  );
};

export default BottomNavigationBar;
