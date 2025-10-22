import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { GetChargeByIdUseCase } from "src/core/application/use-cases/get-charge-by-id.usecase";

@Controller("charges")
@ApiTags('Charges')
export class GetChargeByIdController {
  constructor(
    private readonly getChargeByIdUseCase: GetChargeByIdUseCase
  ) { }

  @Get(":id")
  @ApiOperation({ summary: 'Obter cobrança por ID', description: 'Retorna os dados públicos de uma cobrança pelo seu ID. Para boletos, inclui campos como dueDate e boletoBarCode quando presentes.' })
  @ApiParam({ name: 'id', description: 'ID da cobrança', example: 'cmh23z2od0002mdiwv2j4pao1' })
  @ApiResponse({
    status: 200, description: 'Cobrança encontrada', schema: {
      example: {
        id: 'cmh23z2od0002mdiwv2j4pao1',
        customerId: 'cmh0omr8w0000mdlokij2nqy3',
        amount: 450,
        currency: 'BRL',
        method: 'BANK_SLIP',
        status: 'PENDING',
        createdAt: '2025-10-22T14:48:37.453Z',
        updatedAt: '2025-10-22T14:48:37.453Z',
        dueDate: '2025-11-15T23:59:59.000Z',
        boletoBarCode: 'cmh242v710003mdjo90l2xrc5'
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Cobrança não encontrada', schema: { example: { statusCode: 404, message: "Cobrança com ID 'cmh23z2od0002mdiwv2j4pao1' não encontrada", error: 'Not Found' } } })
  async execute(@Param("id") id: string) {
    return this.getChargeByIdUseCase.execute(id);
  }
}