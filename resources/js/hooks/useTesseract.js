import { createWorker, PSM, OEM } from "tesseract.js";

const worker = null;

const createWorkerInstance = async () => {
    const worker = await createWorker({
        logger: (m) => console.log(m),
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    // await worker.initialize("eng", OEM.LSTM_ONLY);
    await worker.setParameters({
        // tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });

    return worker;
};

const getWorker = async () => {
    return worker || (await createWorkerInstance());
};

const useTesseract = () => {
    return {
        getWorker,
    };
};

export default useTesseract;
