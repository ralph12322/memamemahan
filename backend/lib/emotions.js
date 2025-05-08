import OpenAI from 'openai'
import 'dotenv/config';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getEmotions = async (text) => {

    console.log('working')
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'Just give me the emotion based on this text I gave you, just return me the emotion nothing else. If its other language translate it and give the emotions' },
                { role: 'user', content: text }
            ],
        });

        return completion.choices[0].message.content
    } catch (error) {
        console.error('Error from OpenAI API:', error);
    }
}

export default getEmotions