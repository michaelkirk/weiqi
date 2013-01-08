def render_css
  cell_count = 19*19
  stone_types = {1 => [], 2 => [], 3 => [], 4 => []}

  (0..cell_count).each do |cell_index|
    stone_type = rand(4) + 1
    stone_types[stone_type] << cell_index
  end

  stone_types.each do |stone_type, cell_indices|
    puts (cell_indices.map { |cell_index| "#black .cell:nth-of-type(#{cell_index})" }).join(", ")
    puts "\n\n\n\n"
  end
end

render_css
