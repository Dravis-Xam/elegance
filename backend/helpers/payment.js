import 'dotenv/config';
import { v4 as uuidv4} from 'uuid';

const dom = process.env.NODE_ENV === 'development' ? 'sandbox' : 'openapi';

// Helper to set API base URL
const set_base_url = (e) => `https://uat.openapi.m-pesa.com/${dom}/ipg/v2/${e}`;

// Dynamically resolve domain for country
const getLoc = (loc) => {
    if (!loc) return 'vodafoneDRC';
    switch (loc.toLowerCase()) {
        case 'kenya':
            return 'vodafoneKEN';
        case 'tanzania':
            return 'vodacomTZN';
        case 'lesotho':
            return 'vodacomLES' 
        case 'mozambique':
            return 'vodacomMOZ'
        case 'Egypt':
            return 'vodafoneEGP'
        case 'Ghana':
            return 'vodafoneGHA'
        case 'test':
            return 'vodafoneVF'
        case 'dr congo':
            return 'vodafoneDRC';
        default:
            return 'vodafoneDRC';
    }
};

// Resolve currency for country
const resolveCurrency = (country) => {
    const normalized = country.trim().toUpperCase();
    const currencyMap = {
        DRC: ['CDF', 'USD'],
        LES: 'LSL',
        MOZ: 'MZS',
        TZN: 'TZS',
        EGP: 'EGP',
        GHA: 'GHS',
        KEN: 'KSH',
        VF: 'TZS',

        'DR CONGO': ['CDF', 'USD'],
        'LESOTHO': 'LSL',
        'MOZAMBIQUE': 'MZS',
        'TANZANIA': 'TZS',
        'EGYPT': 'EGP',
        'GHANA': 'GHS',
        'KENYA': 'KSH',
        'TEST': 'TZS',
        'GBR': 'TZS'
    };

    return currencyMap[normalized] || 'USD';
};

// Push USSD request
const pushUSSD = async (loc, payload) => {
    const domain = getLoc(loc);
    const base_url = set_base_url(domain);
    const api_url = `${base_url}/c2bPayment/singleStage/`;
    const session = await getSession(domain);

    if (!session || session === 'Session creation failed') {
        console.error('Could not obtain session');
        return;
    }

    const token = Buffer.from(session).toString('base64');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': '*'
    };

    const { amount, customerNo, country, desc } = payload;
    const currency = resolveCurrency(country);

    const req_body = {
        input_Amount: amount,
        input_CustomerMSISDN: customerNo,
        input_Country: country,
        input_Currency: loc ? currency : "USD",
        input_ServiceProviderCode: "7576520",
        input_TransactionReference: uuidv4().slice(0, 10),
        input_ThirdPartyConversationID: "",
        input_PurchasedItemsDesc: desc
    };

    try {
        const res = await fetch(api_url, {
            method: 'POST',
            headers,
            body: JSON.stringify(req_body)
        });

        const responseData = await res.json();
        if (!res.ok) {
            console.error('USSD Push failed:', responseData);
        } else {
            console.log('USSD Push Success:', responseData);
        }

        return responseData;
    } catch (e) {
        console.error('Fetch error during USSD Push:', e);
    }
};

// Session creation for authentication
async function getSession(loc) {
    const base_url = set_base_url(loc);
    const get_acc_api_url = `${base_url}/getSession/`;

    const token = Buffer.from(process.env.T_PESA_API_KEY || '').toString('base64');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Change to `Basic` if required by provider
        'Origin': '*'
    };

    try {
        const res = await fetch(get_acc_api_url, { headers, method: 'GET' });

        const data = await res.json();

        if (!res.ok) {
            console.error('Session request failed:', data);
            return 'Session creation failed';
        }

        return data.output_SessionID || null;
    } catch (e) {
        console.error('Fetch error in getSession:', e);
        return null;
    }
}

export default pushUSSD;
