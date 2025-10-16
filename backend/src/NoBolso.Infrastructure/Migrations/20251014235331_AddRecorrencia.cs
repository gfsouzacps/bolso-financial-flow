using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoBolso.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRecorrencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Transacoes");

            migrationBuilder.AddColumn<Guid>(
                name: "CarteiraId",
                table: "Transacoes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "CategoriaTransacaoId",
                table: "Transacoes",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Recorrencia",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    DataFim = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EInfinito = table.Column<bool>(type: "boolean", nullable: true),
                    TransacaoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recorrencia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recorrencia_Transacoes_TransacaoId",
                        column: x => x.TransacaoId,
                        principalTable: "Transacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recorrencia_TransacaoId",
                table: "Recorrencia",
                column: "TransacaoId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Recorrencia");

            migrationBuilder.DropColumn(
                name: "CarteiraId",
                table: "Transacoes");

            migrationBuilder.DropColumn(
                name: "CategoriaTransacaoId",
                table: "Transacoes");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Transacoes",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
