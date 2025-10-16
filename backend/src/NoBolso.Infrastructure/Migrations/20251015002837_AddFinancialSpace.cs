using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoBolso.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFinancialSpace : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EspacoFinanceiroId",
                table: "Usuarios",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "EspacosFinanceiros",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EspacosFinanceiros", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Carteiras",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SaldoInicial = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    EspacoFinanceiroId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carteiras", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Carteiras_EspacosFinanceiros_EspacoFinanceiroId",
                        column: x => x.EspacoFinanceiroId,
                        principalTable: "EspacosFinanceiros",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CategoriasTransacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Tipo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Cor = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EspacoFinanceiroId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriasTransacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CategoriasTransacao_EspacosFinanceiros_EspacoFinanceiroId",
                        column: x => x.EspacoFinanceiroId,
                        principalTable: "EspacosFinanceiros",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_EspacoFinanceiroId",
                table: "Usuarios",
                column: "EspacoFinanceiroId");

            migrationBuilder.CreateIndex(
                name: "IX_Carteiras_EspacoFinanceiroId",
                table: "Carteiras",
                column: "EspacoFinanceiroId");

            migrationBuilder.CreateIndex(
                name: "IX_CategoriasTransacao_EspacoFinanceiroId",
                table: "CategoriasTransacao",
                column: "EspacoFinanceiroId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_EspacosFinanceiros_EspacoFinanceiroId",
                table: "Usuarios",
                column: "EspacoFinanceiroId",
                principalTable: "EspacosFinanceiros",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_EspacosFinanceiros_EspacoFinanceiroId",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "Carteiras");

            migrationBuilder.DropTable(
                name: "CategoriasTransacao");

            migrationBuilder.DropTable(
                name: "EspacosFinanceiros");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_EspacoFinanceiroId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "EspacoFinanceiroId",
                table: "Usuarios");
        }
    }
}
