import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '@src/../test/test.module';
import { DB_CONNECTION } from '@src/database';
import { Connection, disconnect, Mongoose } from 'mongoose';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let module: TestingModule;
  let service: UtilService;
  let connection: Connection;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TestModule],
      providers: [UtilService],
    }).compile();

    service = module.get<UtilService>(UtilService);
    connection = module.get<Mongoose>(DB_CONNECTION).connection;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('#formatCurrency should format amount to 2 decimal', () => {
    const res = service.formatCurrency('20000.9292', 2);
    expect(res).toBe('20,000.93');
  });

  it('#parsePhonenumber should format local phonenumber to international', () => {
    const res = service.parsePhonenumber('08174506678');
    expect(res).toBe('+2348174506678');
  });

  it('#parsePhonenumber should format local short form phonenumber to international', () => {
    const res = service.parsePhonenumber('8174506678');
    expect(res).toBe('+2348174506678');
  });

  it('#parsePhonenumber should format international phonenumber to international', () => {
    const res = service.parsePhonenumber('23408174506678');
    expect(res).toBe('+2348174506678');
  });

  it('#parsePhonenumber should format international(+)  phonenumber to international', () => {
    const res = service.parsePhonenumber('+2348174506678');
    expect(res).toBe('+2348174506678');
  });

  it('#parsePhonenumber should format local phonenumber(Ghana) to international', () => {
    const res = service.parsePhonenumber('302668441', 'GH');
    expect(res).toBe('+233302668441');
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
    await module.close();
  });
});
