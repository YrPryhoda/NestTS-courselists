import { AuthDto } from './../src/auth/dto/auth.dto';
import { disconnect } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { USER_NOT_FOUND, WRONG_PASSWORD } from '../src/auth/auth.constants';

const userForLogin: AuthDto = {
	login: 'a',
	password: '123',
};

describe('Auth Controller', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/api/auth/login (POST) - success', async (done) => {
		await request(app.getHttpServer())
			.post('/auth/login')
			.send(userForLogin)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
				done();
			});
	});

	it('/api/auth/login (POST) - Not found', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...userForLogin, login: 'b' });

		expect(body.message).toBe(USER_NOT_FOUND);
	});

	it('/api/auth/login (POST) - Wrong pass', async () => {
		const { body } = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...userForLogin, password: '333' });

		expect(body.message).toBe(WRONG_PASSWORD);
	});

	afterAll(() => {
		disconnect();
	});
});
