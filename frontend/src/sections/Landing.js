import axios from "axios";
import "../styles/landing.css";
import { URL } from "../constants";
import { useQuery } from "react-query";
import loadable from "@loadable/component";
const ScrollTextLand = loadable(() => import("../components/ScrollTextLand"));

const Landing = () => {
  //

  const walletAddress = localStorage.getItem("address");

  const { isLoading, error, data } = useQuery(
    "committed",
    () =>
      axios
        .get(`${URL}/committed/${walletAddress}`)
        .then((response) => response.data.data),
    {
      enabled: !!walletAddress,
    }
  );

  return (
    <div className="landing" id="landing">
      <ScrollTextLand
        word={"Decentralised NACOS Voting System Using Algorand"}
      />
      <div
        style={{
          width: "100%",
          height: "20px",
          fontSize: "13px",
          fontWeight: "500",
          marginTop: "10px",
          textTransform: "uppercase",
        }}
      >
        Total amount committed to voting:{" "}
        {!isLoading && !error && data?.amount / 10000} $ALGO
      </div>

      <div className="land_cov">
        <div className="land_item1">
          <div className="icon_title">
            <img src="/img/school_logo.jpeg" alt="" />
            <p className="hdy">NACOS</p>
          </div>

          <p className="suby">
            NACOS Voting System using Algorand Blockchain
            <br />
            <br />
            Platfrom for Decentralized Decisions to enable students create,
            explore and participate in elections anonymously.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
