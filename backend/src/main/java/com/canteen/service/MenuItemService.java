package com.canteen.service;

import com.canteen.dto.MenuItemRequest;
import com.canteen.entity.MenuItem;
import com.canteen.exception.ResourceNotFoundException;
import com.canteen.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems(String category, Boolean availableOnly) {
        if (category != null && !category.trim().isEmpty() && Boolean.TRUE.equals(availableOnly)) {
            return menuItemRepository.findByCategoryAndAvailable(category.trim(), true);
        } else if (category != null && !category.trim().isEmpty()) {
            return menuItemRepository.findByCategory(category.trim());
        } else if (Boolean.TRUE.equals(availableOnly)) {
            return menuItemRepository.findByAvailable(true);
        }
        return menuItemRepository.findAll();
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
    }

    @Transactional
    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuItem menuItem = MenuItem.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .category(request.getCategory().trim())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .build();

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem existing = getMenuItemById(id);

        existing.setName(request.getName().trim());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory().trim());
        existing.setPrice(request.getPrice());
        existing.setImageUrl(request.getImageUrl());
        if (request.getAvailable() != null) {
            existing.setAvailable(request.getAvailable());
        }

        return menuItemRepository.save(existing);
    }

    @Transactional
    public MenuItem toggleAvailability(Long id) {
        MenuItem existing = getMenuItemById(id);
        existing.setAvailable(!Boolean.TRUE.equals(existing.getAvailable()));
        return menuItemRepository.save(existing);
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }
}
