import OpenAI from 'openai';
import dotenv from 'dotenv';
import https from 'https';
import { stringify as qsStringify } from 'querystring';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const getEmotions = async (text) => {

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Just give me the emotion based on this text I gave you, just return me the emotion nothing else. If its other language translate it and give the emotions' },
                { role: 'user', content: text }
            ],
        });

        const message = "OPENAI used"

        return {emotion : completion.choices[0].message.content, source: message }
    } catch (error) {
        console.error('Error from OpenAI API:', error);
    }
}

export const getEmotionsv2 = async (text) => {
	try {
		const options = {
			method: 'POST',
			hostname: 'twinword-emotion-analysis-v1.p.rapidapi.com',
			port: null,
			path: '/analyze/',
			headers: {
				'x-rapidapi-key': process.env.RAPIDAPI_KEY,
				'x-rapidapi-host': process.env.RAPIDAPI_HOST,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		};

		const emotion = await new Promise((resolve, reject) => {
			const twinReq = https.request(options, (twinRes) => {
				const chunks = [];

				twinRes.on('data', (chunk) => chunks.push(chunk));
				twinRes.on('end', () => {
					try {
                        const message = "TWINWORD used"
						const body = Buffer.concat(chunks).toString();
						const json = JSON.parse(body);
					
						console.log('Twinword response:', json);

						if (json.emotions_detected && json.emotions_detected.length > 0) {
							resolve({emotion: json.emotions_detected[0], source: message});
						} else {
							resolve({emotion: "neutral", source: "none"}); 
						}
					} catch (err) {
						reject(new Error('Failed to parse response as JSON'));
					}
				});
			});

			twinReq.on('error', (err) => {
				reject(err);
			});

			twinReq.write(qsStringify({ text }));
			twinReq.end();

			return emotion
		});
	
	} catch (error) {
		console.error('Error from Twinword API:', error);
		return "error";
	}
};
