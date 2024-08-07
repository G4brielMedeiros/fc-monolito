import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto";
import InvoiceFacadeInterface from "./invoice.facade.interface";
import {
  GenerateInvoiceFacadeInputDto,
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  generateUsecase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _generateUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._generateUsecase = usecaseProps.generateUsecase;
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateUsecase.execute(input);
  }
  async find(
    input: FindInvoiceFacadeInputDto
  ): Promise<FindInvoiceFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
