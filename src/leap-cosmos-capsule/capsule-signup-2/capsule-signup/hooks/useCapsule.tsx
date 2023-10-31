/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import Capsule from "@usecapsule/web-sdk";
import { Wallet } from "@usecapsule/web-sdk/dist/Capsule";
import { useEffect, useRef, useState } from "react";

import { ModalStep } from "../constant";
const STORAGE_PREFIX = "@CAPSULE/";
const POLLING_INTERVAL_MS = 2000;

export default function useCapsule(
  capsule: Capsule,
  showCapsuleModal: boolean,
) {
  const [emailInput, setEmailInput] = useState(capsule?.getEmail() ?? "");
  const [otpInput, setOtpInput] = useState("");
  const [error, setError] = useState("");
  let interval:ReturnType<typeof setInterval>;

  const [createWalletRes, setCreateWalletRes] =
    useState<[Wallet, string | null]>();
  const [recoveryShare, setRecoveryShare] = useState<string>();

  // Current Step
  const [currentStep, setCurrentStepState] = useState(
    (sessionStorage.getItem(`${STORAGE_PREFIX}currentStep`) as ModalStep) ||
      ModalStep.EMAIL_COLLECTION,
  );
  const setCurrentStep = (value: ModalStep) => {
    setCurrentStepState(value);
    sessionStorage.setItem(`${STORAGE_PREFIX}currentStep`, value);
  };

  const [paillierGenDone, setPaillierGenDone] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [walletCreationInProgress, setWalletCreationInProgress] =
    useState(false);
  const [webAuthURLForLogin, setWebAuthURLForLoginState] = useState(
    sessionStorage.getItem(`${STORAGE_PREFIX}webAuthURLForLogin`) || "",
  );
  const setWebAuthURLForLogin = (value: string) => {
    setWebAuthURLForLoginState(value);
    sessionStorage.setItem(`${STORAGE_PREFIX}webAuthURLForLogin`, value);
  };
  const [isCreateAccountType, setIsCreateAccountTypeState] = useState(
    sessionStorage.getItem(`${STORAGE_PREFIX}isCreateAccountType`) === "true",
  );
  const setIsCreateAccountType = (value: boolean) => {
    setIsCreateAccountTypeState(value);
    sessionStorage.setItem(
      `${STORAGE_PREFIX}isCreateAccountType`,
      value.toString(),
    );
  };
  const [distributeDone, setDistributeDone] = useState(false);
  const [isFullyLoggedIn, setIsFullyLoggedInState] = useState(
    sessionStorage.getItem(`${STORAGE_PREFIX}isFullyLoggedIn`) === "true",
  );
  const setIsFullyLoggedIn = (value: boolean) => {
    setIsFullyLoggedInState(value);
    sessionStorage.setItem(
      `${STORAGE_PREFIX}isFullyLoggedIn`,
      value.toString(),
    );
  };
  const [webAuthURLForCreate, setWebAuthURLForCreateState] = useState(
    sessionStorage.getItem(`${STORAGE_PREFIX}webAuthURLForCreate`) || "",
  );
  const setWebAuthURLForCreate = (value: string) => {
    setWebAuthURLForCreateState(value);
    sessionStorage.setItem(`${STORAGE_PREFIX}webAuthURLForCreate`, value);
  };

  const onEmailEnter = async () => {
    if (!emailInput) {
      throw new Error("email is required");
    }
    capsule?.clearStorage(true);
    await capsule.logout();

    try {
      const userExists = await capsule?.checkIfUserExists(emailInput);
      if (userExists) {
        const webAuthUrlForLogin = await capsule.initiateUserLogin(emailInput);
        setCurrentStep(ModalStep.BIOMETRIC_LOGIN);
        setWebAuthURLForLogin(webAuthUrlForLogin);
        return;
      }

      await capsule.createUser(emailInput);
      setCurrentStep(ModalStep.VERIFICATION_CODE);
      setIsCreateAccountType(true);
    } catch (e) {
      setError("Invalid Email");
    }
  };

  const createAccountTimeout = useRef<number>();
  const loginTimeout = useRef<number>();

  const [percentKeygenDone, setPercentKeygenDone] = useState(
    paillierGenDone ? 25 : 0,
  );

  const onReset = () => {
    setCurrentStep(ModalStep.EMAIL_COLLECTION);
    setIsFullyLoggedIn(false);
    setDistributeDone(false);
    setIsCreateAccountType(false);
    setWebAuthURLForLogin("");
    setWebAuthURLForLogin("");
    setWebAuthURLForCreate("");
    setWalletCreated(false);
    setPercentKeygenDone(paillierGenDone ? 25 : 0);
    setCreateWalletRes(undefined);
    setRecoveryShare(undefined);
    capsule.logout()
  };

  useEffect(() => {
    if (
      !showCapsuleModal &&
      [ModalStep.LOGIN_DONE, ModalStep.ACCOUNT_CREATION_DONE].includes(
        currentStep,
      )
    ) {
      setCurrentStep(ModalStep.EMAIL_COLLECTION);
      setIsFullyLoggedIn(false);
      setDistributeDone(false);
      setIsCreateAccountType(false);
      setWebAuthURLForLogin("");
      setWebAuthURLForLogin("");
      setWebAuthURLForCreate("");
      setWalletCreated(false);
      setPercentKeygenDone(paillierGenDone ? 25 : 0);
      setCreateWalletRes(undefined);
      setRecoveryShare(undefined);
    }
  }, [showCapsuleModal]);

  // function should be called a total of 5 times
  function keygenStatusFunction() {
    setPercentKeygenDone((percentKeygenDone) => percentKeygenDone + 15);
  }

  // generate paillier secret key ahead of time
  useEffect(() => {
    // TODO probably we should invalidate it after using...
    async function genPaillierKey() {
      try {
        await capsule?.generatePaillierKey();
        setPaillierGenDone(true);
        setPercentKeygenDone(25);
      } catch (e: unknown) {
        console.log(e);
        setError("Error Generating PaillierKey");
      }
    }
    genPaillierKey();
  }, []);

  // generate wallet once we know it's account creation
  useEffect(() => {
    if (
      (!isCreateAccountType &&
        currentStep !== ModalStep.AWAITING_WALLET_CREATION_AFTER_LOGIN) ||
      walletCreated ||
      !paillierGenDone ||
      walletCreationInProgress
    ) {
      return;
    }
    async function genWallet() {
      setWalletCreationInProgress(true);
      let createWalletRes;
      try {
        createWalletRes = await capsule.createWallet(
          true,
          keygenStatusFunction,
        );
      } catch (e) {
        setError("Error Creating wallet");
      }
      setCreateWalletRes(createWalletRes);
      setWalletCreated(true);
      setWalletCreationInProgress(false);
    }
    genWallet();
  }, [paillierGenDone, isCreateAccountType, currentStep]);

  // distribute share once we know keygen is done
  useEffect(() => {
    if (distributeDone || !isFullyLoggedIn || !walletCreated) {
      return;
    }

    async function distributeShare() {
      if (!createWalletRes) return;
      let result;
      try {
        result = await capsule.distributeNewWalletShare(
          createWalletRes[0].id,
          createWalletRes[0].signer,
        );
      } catch (e) {
        setError("Error creating distribution for new wallet share");
      }
      setRecoveryShare(result);
      setDistributeDone(true);
      if (currentStep === ModalStep.AWAITING_WALLET_CREATION_AFTER_LOGIN) {
        setCurrentStep(ModalStep.LOGIN_DONE);
      } else {
        setCurrentStep(ModalStep.ACCOUNT_CREATION_DONE);
      }
    }
    distributeShare();
  }, [isFullyLoggedIn, walletCreated, createWalletRes]);

  async function awaitWalletCreationTransition(): Promise<void> {
    try {
      if (await capsule.isSessionActive()) {
        setIsFullyLoggedIn(true);
        setWebAuthURLForCreate("");
        setCurrentStep(ModalStep.AWAITING_WALLET_CREATION);
        return;
      }
    } catch (err) {
      // want to continue polling on error and still set timeout
      console.error(err);
    }
    createAccountTimeout.current = window.setTimeout(
      awaitWalletCreationTransition,
      POLLING_INTERVAL_MS,
    );
  }

  // wait for biometric to be added to move on to next step
  useEffect(() => {
    if (webAuthURLForCreate) {
      createAccountTimeout.current = window.setTimeout(
        awaitWalletCreationTransition,
        POLLING_INTERVAL_MS,
      );
    }
    return () => clearTimeout(createAccountTimeout.current);
  }, [webAuthURLForCreate]);

  async function awaitLoginTransition(): Promise<void> {
    try {
      const isActive = await capsule.isSessionActive();

      console.log("Awating awaitLoginTransition", isActive, capsule);
      if (!isActive) {
        loginTimeout.current = window.setTimeout(
          awaitLoginTransition,
          POLLING_INTERVAL_MS,
        );
        return;
      }
      await capsule.userSetupAfterLogin();

      const fetchedWallets = (await capsule.fetchWallets()).filter(
        (wallet) => !!wallet.address,
      );
      const tempSharesRes = await capsule.getTransmissionKeyShares();
      console.log(fetchedWallets, tempSharesRes);
      // need this check for the case where user has logged in but temp encrypted shares
      // haven't been sent to the backend yet
      if (tempSharesRes.data.temporaryShares.length === fetchedWallets.length) {
        await capsule.setupAfterLogin(tempSharesRes.data.temporaryShares);
        setIsFullyLoggedIn(true);
        setWebAuthURLForLogin("");

        if (Object.values(capsule.getWallets()).length === 0) {
          setCurrentStep(ModalStep.AWAITING_WALLET_CREATION_AFTER_LOGIN);
          return;
        }
        setCurrentStep(ModalStep.LOGIN_DONE);
        return;
      }
    } catch (err) {
      // want to continue polling on error and still set timeout
      console.error(err);
      setError("Error fetching wallet!");
    }
    loginTimeout.current = window.setTimeout(
      awaitLoginTransition,
      POLLING_INTERVAL_MS,
    );
  }

  // wait for login auth to do post login setup
  useEffect(() => {
    if (webAuthURLForLogin) {
      loginTimeout.current = window.setTimeout(
        awaitLoginTransition,
        POLLING_INTERVAL_MS,
      );
    }
    return () => clearTimeout(loginTimeout.current);
  }, [webAuthURLForLogin]);

  /**
   * Otp verification
   */

  const [resendStatus, setResendStatus] = useState("Resend Code");
  const [isResendButtonDisabled, setResendButtonDisabled] = useState(false);

  const resendVerificationCode = async () => {
    let timer = 30;
    clearInterval(interval);
    setResendStatus(`Resend again in ${timer}s`);
    interval = setInterval(() => {
      timer = timer - 1;
      setResendStatus(() => { return `Resend again in ${timer}s` })
      if(timer === 0) {
        clearInterval(interval);
      }
    }, 1000)
    setResendButtonDisabled(true);
    await capsule.resendVerificationCode();

    setTimeout(() => {
      setResendStatus("Resend Code");
      setResendButtonDisabled(false);
    }, 30000);
  };

  const verifyCode = async () => {
    if (otpInput.length === 6 && /^\d+$/.test(otpInput)) {
      try {
        setWebAuthURLForCreate(await capsule.verifyEmail(otpInput));
        setError("");
        setCurrentStep(ModalStep.BIOMETRIC_CREATION);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (e.message.includes("429")) {
          setError("Too many attempts");
        } else {
          setError("Incorrect Code");
        }
      }
    } else {
      setError("Incorrect Code");
    }
  };

  useEffect(() => {
    if (currentStep === ModalStep.VERIFICATION_CODE) {
      setCurrentStep(ModalStep.EMAIL_COLLECTION);
    }
  }, [emailInput]);

  return {
    currentStep,
    setCurrentStep,

    onReset,

    // Email
    emailInput,
    error,
    setEmailInput,
    onEmailEnter,

    // Verification Code
    otpInput,
    isResendButtonDisabled,
    resendStatus,
    setOtpInput,
    resendVerificationCode,
    verifyCode,

    // Biometric
    webAuthURLForCreate,
    webAuthURLForLogin,

    percentKeygenDone,
    setError,
    recoveryShare,
  };
}
