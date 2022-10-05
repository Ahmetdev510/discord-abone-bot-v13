const { createWorker } = require('tesseract.js');

const ReadText = (imgfile, oem, psm) => {

    const oem_var = oem || 2
    const psm_var = psm || 3

    try {
        return new Promise((resolve, reject) => {
            const worker = createWorker({
                //   logger: m => console.log(m)
            });
            worker.load().then(() => {
                worker.loadLanguage('eng+osd').then(() => {
                    worker.initialize('eng+osd').then(() => {
                        worker.setParameters({
                            tessedit_ocr_engine_mode: oem_var,
                            tessedit_pageseg_mode: psm_var,
                        }).then(() => {
                            worker.recognize(imgfile, {
                            }).then(({ data: { text } }) => {
                                resolve(text)
                            }).finally(() => {
                                
                            })
                        })
                    });
                })
            })

        });

    }
    catch (e) {
        return `An error occurred: ${e}`
    }
}










module.exports = ReadText