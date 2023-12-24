import math
import random

class GameBoard:
    def __init__(self, size=10):
        self.size = size
        self.board = [[0] * size for _ in range(size)]
        self.last_move = None

    def is_valid_move(self, row, col):
        return 0 <= row < self.size and 0 <= col < self.size and self.board[row][col] == 0

    def get_legal_moves(self):
        adjacent_offsets = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
        legal_moves = []

        for r in range(self.size):
            for c in range(self.size):
                if self.board[r][c] == 0:
                    for dr, dc in adjacent_offsets:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < self.size and 0 <= nc < self.size and self.board[nr][nc] != 0:
                            legal_moves.append((r, c))
                            break

        return legal_moves

    def perform_move(self, row, col, player):
        if self.is_valid_move(row, col):
            self.board[row][col] = player
            self.last_move = (row, col)

    def is_terminal(self):
        return self.get_winner() != 0 or all(all(cell != 0 for cell in row) for row in self.board)

    def get_winner(self):
        for r in range(self.size):
            for c in range(self.size):
                if self.board[r][c] != 0 and self.check_winner(r, c):
                    return self.board[r][c]
        return 0

    def check_winner(self, row, col):
        directions = [(0, 1), (1, 0), (1, 1), (1, -1)]
        player = self.board[row][col]

        for dr, dc in directions:
            count = 1
            for i in range(1, 5):
                r, c = row + i * dr, col + i * dc
                if 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                    count += 1
                else:
                    break

            for i in range(1, 5):
                r, c = row - i * dr, col - i * dc
                if 0 <= r < self.size and 0 <= c < self.size and self.board[r][c] == player:
                    count += 1
                else:
                    break

            if count >= 5:
                return True

        return False

    def copy(self):
        new_board = GameBoard(self.size)
        new_board.board = [row.copy() for row in self.board]
        new_board.last_move = self.last_move
        return new_board

class MCTSNode:
    def __init__(self, state, parent=None):
        self.state = state
        self.parent = parent
        self.children = []
        self.visits = 0
        self.wins = 0

def select(node):
    while not node.state.is_terminal():
        if len(node.children) < len(node.state.get_legal_moves()):
            return expand(node)
        else:
            node = best_child(node)
    return node

def expand(node):
    legal_moves = node.state.get_legal_moves()
    untried_moves = [move for move in legal_moves if move not in [child.state.last_move for child in node.children]]

    if untried_moves:
        move = random.choice(untried_moves)
        new_state = node.state.copy()
        new_state.perform_move(*move, player=-1)
        new_node = MCTSNode(new_state, parent=node)
        node.children.append(new_node)
        return new_node
    else:
        return best_child(node)

def best_child(node):
    exploration_weight = 1.4
    best_score = float('-inf')
    best_child = None

    for child in node.children:
        score = (child.wins / child.visits) + exploration_weight * math.sqrt(math.log(node.visits) / child.visits)
        if score > best_score:
            best_score = score
            best_child = child

    return best_child

def simulate(node):
    current_state = node.state.copy()
    while not current_state.is_terminal():
        legal_moves = current_state.get_legal_moves()
        move = random.choice(legal_moves)
        current_state.perform_move(*move, player=-1)
    return current_state.get_winner()

def backpropagate(node, result):
    while node is not None:
        node.visits += 1
        if result == -1:
            node.wins += 1
        node = node.parent

def display_board(board):
    print("   " + " ".join(map(str, range(board.size))))  # 显示列数，从0开始
    for r in range(board.size):
        print(f"{r} {' '.join(map(lambda x: 'X' if x == 1 else 'O' if x == -1 else '.', board.board[r]))}")

def human_player(board):
    move = input("Enter your move (row, column): ")
    row, col = map(int, move.split(','))
    return row, col

def main():
    board = GameBoard()
    player_turn = 1  # 1 for human, -1 for computer

    while not board.is_terminal():
        display_board(board)

        if player_turn == 1:
            row, col = human_player(board)
        else:
            root = MCTSNode(board)
            for _ in range(10000):
                selected_node = select(root)
                result = simulate(selected_node)
                backpropagate(selected_node, result)

            best_child_node = best_child(root)
            row, col = best_child_node.state.last_move

        board.perform_move(row, col, player_turn)
        player_turn *= -1

    display_board(board)
    winner = board.get_winner()
    if winner == 0:
        print("It's a draw!")
    else:
        print(f"Player {winner} wins!")

if __name__ == "__main__":
    main()
