
export default function *() {

	// Getting current state. Initialize state if state doesn't exist.
	var store = this.getState('Tickets', {
		data: [
			{
				'qrcode': 'fb1c424bf6eb3b8a',
				'people': 'many',
				'price': 9,
				'times': 24
			},
			{
				'qrcode': 'dedb266d9c1e0347',
				'people': 'many',
				'price': 1,
				'times': 24
			},
			{
				'qrcode': 'e43364c8fa5b804b',
				'people': 'many',
				'price': 5,
				'times': 24
			},
			{
				'qrcode': '947b282a978de2ae',
				'people': 1,
				'price': 1,
				'times': 24
			},
			{
				'qrcode': '1ef902f0099a68c7',
				'people': 1,
				'price': 1,
				'times': 3
			},
			{
				'qrcode': 'bce414ad7936a799',
				'people': 'many',
				'price': 1,
				'times': 3
			},
			{
				'qrcode': '786a9d01278af5dd',
				'people': 2,
				'price': 5,
				'times': 8
			},
			{
				'qrcode': '2aa704b1fbb7fda2',
				'people': 1,
				'price': 1,
				'times': 8
			},
			{
				'qrcode': '29358b24efc7c0e2',
				'people': 1,
				'price': 5,
				'times': 24
			},
			{
				'qrcode': 'c409a7b2d13b97f8',
				'people': 'many',
				'price': 1,
				'times': 8
			},
			{
				'qrcode': '872cc32b89ab3824',
				'people': 2,
				'price': 9,
				'times': 3
			},
			{
				'qrcode': '3f3841d595c938d1',
				'people': 1,
				'price': 5,
				'times': 3
			},
			{
				'qrcode': '43037e111fa80b1c',
				'people': 1,
				'price': 9,
				'times': 24
			},
			{
				'qrcode': 'c771240f4f1e4f36',
				'people': 'many',
				'price': 5,
				'times': 3
			},
			{
				'qrcode': '932a866f3a6f7c0c',
				'people': 2,
				'price': 9,
				'times': 8
			},
			{
				'qrcode': '5b8098c77da64f34',
				'people': 1,
				'price': 5,
				'times': 8
			},
			{
				'qrcode': '826397d7f2122aff',
				'people': 2,
				'price': 1,
				'times': 24
			},
			{
				'qrcode': 'd7b591c3b4211daa',
				'people': 'many',
				'price': 5,
				'times': 8
			},
			{
				'qrcode': '503b9343fd3e7e08',
				'people': 2,
				'price': 1,
				'times': 3
			},
			{
				'qrcode': '47ce9c6646ff13a7',
				'people': 1,
				'price': 9,
				'times': 3
			},
			{
				'qrcode': '5494228404ae52a2',
				'people': 2,
				'price': 5,
				'times': 24
			},
			{
				'qrcode': '5494228404ae52a2',
				'people': 2,
				'price': 5,
				'times': 24
			},
			{
				'qrcode': 'd493c5f7db906114',
				'people': 'many',
				'price': 9,
				'times': 3
			},
			{
				'qrcode': '579cd4f4c8012059',
				'people': 2,
				'price': 1,
				'times': 8
			},
			{
				'qrcode': '49f9a66a64b72b2e',
				'people': 1,
				'price': 9,
				'times': 8
			},
			{
				'qrcode': 'b31c0ed3c3606603',
				'people': 2,
				'price': 9,
				'times': 24
			},
			{
				'qrcode': 'd46414a2e10d8d73',
				'people': 'many',
				'price': 9,
				'times': 8
			},
			{
				'qrcode': '782e61c302e1e614',
				'people': 2,
				'price': 5,
				'times': 3
			}
		]
	});
};
