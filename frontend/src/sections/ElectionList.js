import _ from "lodash";
import $ from "jquery";
import "../styles/electionlist.scss";
import { useQuery } from "react-query";
import axios from "axios";
import { URL } from "../constants";
import { useState } from "react";

import BarLoader from "react-spinners/BarLoader";
import algosdk, { waitForConfirmation } from "algosdk";
import { indexerClient, algodClient, myAlgoConnect } from "../utils";
import { MatricNumbs } from "../MatricNums";

const ElectionList = () => {
  const [matricNum, setMatricNum] = useState(8888);
  const [selectedAddr, setSelectedAddr] = useState("");
  const walletAddress = localStorage.getItem("address");

  const { isLoading, refetch, isFetching, error, data } = useQuery(
    "elections",
    () => axios.get(`${URL}/elections`).then((response) => response.data.data),
    {
      refetchInterval: 60000,
    }
  );
  // Register vote functions

  const AlgoConnect = async (voteData) => {
    try {
      const myAccountInfo = await indexerClient
        .lookupAccountByID(walletAddress)
        .do();

      // get balance of the voter
      const balance = myAccountInfo.account.amount / 1000000;

      if (voteData.amount > balance) {
        alert("You do not have sufficient balance to make this transaction.");
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = voteData.amount * 1000000;

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: walletAddress,
        to: voteData.address,
        amount: amountToSend,
        suggestedParams,
      });

      const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
      await algodClient
        .sendRawTransaction(signedTxn.blob)
        .do()
        .then(async (submittedTxn) => {
          // alert success
          alert("You vote has been successfully registered!");

          axios
            .post(`${URL}/elections/${voteData?.election?.slug}/voters`, {
              address: walletAddress,
              matric_no: matricNum.toString(),
            })
            .then((response) => console.log(response?.data));

          await waitForConfirmation(algodClient, submittedTxn.txId, 1000);

          $(".reloadBalance").click();
          $(".refresh_elections_list").click();
        });
    } catch (error) {
      alert(error?.message);
    }
  };

  const placeVote = (address, amount, election) => {
    var containsMatric = MatricNumbs.some(
      (elem) => matricNum.toString() === elem?.matricNo?.toString()
    );

    var containsAddress = MatricNumbs.some(
      (elem) =>
        matricNum.toString() === elem?.matricNo?.toString() &&
        walletAddress === elem?.matricAddress
    );

    var votedMatric = election?.voters?.some(
      (elem) => matricNum.toString() === elem?.matric_no?.toString()
    );

    var votedAddress = election?.voters?.some(
      (elem) => walletAddress === elem?.address
    );

    if (!containsMatric) {
      alert("Provide a valid Matric number");
      return;
    }

    if (!containsAddress) {
      alert("Matric number does not match connected wallet address");
      return;
    }

    if (!walletAddress) {
      alert("Connect your wallet to vote!");
      return;
    }

    if (!!(votedMatric || votedAddress)) {
      alert("The Matric number attached to this address has voted already");
      return;
    }

    if (!address) {
      alert("Select an option to vote!");
      return;
    }

    AlgoConnect({ address, amount, election });
  };

  if (isLoading) {
    return (
      <>
        <div className="ptt_elt">
          <div className="ptt_elt_inn">
            <div className="ptt_hd">
              <p>Active Elections</p>
            </div>
            <div
              style={{
                width: "100%",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "500",
                color: "var(--wht)",
                justifyContent: "center",
                textTransform: "uppercase",
              }}
            >
              <p style={{ opacity: 0.5, marginBottom: "30px" }}>
                Loading elections...
              </p>

              <BarLoader
                color={"#eee"}
                loading={true}
                size={10}
                speedMultiplier={0.5}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="ptt_elt">
      <div className="ptt_elt_inn">
        <div className="ptt_hd">
          <p>Active Elections</p>
          <span className="refresh_elections_list" onClick={refetch} />
          {isFetching ? (
            <div className="refreshing_text">
              <p>Refreshing </p>
              <i className="ph-spinner"></i>
            </div>
          ) : null}
        </div>

        <div className="matric_num_cont">
          <p>Enter Registration Number</p>
          <input
            type="number"
            className="matric_input"
            value={matricNum}
            onChange={(e) => setMatricNum(e.target.value)}
          />
        </div>

        <ul className="card_list">
          {data?.map((slug, index) => {
            const scores = slug?.candidates.map((data) =>
              data?.votes
                ? Math.round(Number(data?.votes - 0.05) * 100) / 100
                : 0
            );
            const totalScore = _.sum(scores);
            return (
              <div className="card_cont" key={index}>
                <div className="card_r1">
                  <div className="card_elt_img">
                    {!!slug?.process_image ? (
                      <img src={slug.process_image} alt="" />
                    ) : (
                      <i className="uil uil-mailbox"></i>
                    )}
                  </div>
                  <div className="card_elt_tit">{slug.title}</div>
                </div>

                <div className="card_elt_desc">{slug?.card_desc}</div>

                <div className="card_cand_hd">Results Updates:</div>

                <ul className="election_results">
                  {slug?.candidates?.map((item, index) => (
                    <li className="result_item" key={index}>
                      <div className="res_name_score">
                        <p className="res_item_name">{item?.name}</p>
                        <p className="res_score">
                          {Math.round(Number(item?.votes - 0.05) * 100) / 100}
                          &nbsp;:
                        </p>
                      </div>
                      <div className="res_bar">
                        <div
                          className="res_reached"
                          style={{
                            width: `calc(100% * ${
                              totalScore !== 0
                                ? Math.round(Number(item?.votes - 0.05) * 100) /
                                  100 /
                                  totalScore
                                : 0
                            })`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="card_cand_hd">Select an option below:</div>

                <div className="card_cand">
                  <ul className="card_cand_list">
                    {slug?.candidates?.map((item, index) => (
                      <li
                        className={`cand_item ${
                          item?.address === selectedAddr ? "selected" : ""
                        }`}
                        key={index}
                        onClick={() => {
                          setSelectedAddr(item?.address);
                        }}
                      >
                        <div className="cand_img_cont">
                          {!!item.image ? (
                            <img src={item.image} alt="" />
                          ) : (
                            <i className="ph-circle-wavy-check"></i>
                          )}
                        </div>
                        <p className="cand_det">{item.name}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="rec_vote_cont">
                    <button
                      className="record_vote"
                      onClick={(e) => {
                        placeVote(selectedAddr, slug?.algo_per_vote, slug);
                      }}
                    >
                      Submit vote
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ElectionList;
